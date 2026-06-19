const { sequelize, Sale, SaleItem, Produto } = require('../database/models');

class SaleService {
  async createSale(saleData) {
    const {
      items = [],
      empresaId,
      filialId,
      usuarioId,
      clienteId = null,
      formaPagamento,
      pagamentos = [],
      desconto = 0,
      acrescimo = 0,
      observacoes = null,
    } = saleData;

    if (!empresaId || !filialId || !usuarioId) {
      throw new Error('empresaId, filialId e usuarioId são obrigatórios');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Informe ao menos um item para finalizar a venda');
    }

    return await sequelize.transaction(async (transaction) => {
      let total = 0;
      const saleItems = [];

      for (const item of items) {
        const productId = item.productId || item.produtoId;
        const quantity = Number(item.quantity ?? item.quantidade ?? item.qtd);

        if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
          throw new Error('Item de venda inválido');
        }

        const product = await Produto.findByPk(productId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!product) {
          throw new Error(`Produto ${productId} não encontrado`);
        }

        const stock = Number(product.estoqueAtual || 0);
        if (product.controlaEstoque && stock < quantity) {
          throw new Error(`Estoque insuficiente para ${product.nome}`);
        }

        const unitPrice = Number(item.price ?? item.precoUnitario ?? product.precoVenda ?? 0);
        const itemDiscount = Number(item.discount ?? item.desconto ?? 0);
        const itemTotal = Math.max(0, unitPrice * quantity - itemDiscount);
        total += itemTotal;

        if (product.controlaEstoque) {
          await product.decrement('estoqueAtual', { by: quantity, transaction });
        }

        saleItems.push({
          produtoId: product.id,
          quantidade: quantity,
          precoUnitario: unitPrice,
          precoTotal: itemTotal,
          desconto: itemDiscount,
          custoUnitario: Number(product.precoCusto || 0),
          ncm: product.ncm,
          cfop: product.cfop,
          unidade: product.unidade,
        });
      }

      const subtotal = total;
      const finalTotal = Math.max(0, subtotal - Number(desconto || 0) + Number(acrescimo || 0));
      const lastSale = await Sale.findOne({
        where: { empresaId, filialId },
        order: [['numero', 'DESC']],
        transaction,
      });

      const sale = await Sale.create({
        empresaId,
        filialId,
        usuarioId,
        clienteId,
        numero: lastSale ? Number(lastSale.numero) + 1 : 1,
        status: 'finalizada',
        subtotal,
        desconto,
        acrescimo,
        total: finalTotal,
        formaPagamento: formaPagamento || pagamentos.map(p => p.forma || p.tipo).filter(Boolean).join(',') || null,
        observacoes,
        dataVenda: new Date(),
      }, { transaction });

      await SaleItem.bulkCreate(
        saleItems.map(item => ({ ...item, saleId: sale.id })),
        { transaction }
      );

      return await Sale.findByPk(sale.id, {
        include: [{ model: SaleItem, as: 'itens' }],
        transaction,
      });
    });
  }

  async getSaleById(id) {
    return await Sale.findByPk(id, {
      include: [{ model: SaleItem, as: 'itens' }],
    });
  }

  async getAllSales() {
    return await Sale.findAll({
      include: [{ model: SaleItem, as: 'itens' }],
      order: [['dataVenda', 'DESC']],
    });
  }
}

module.exports = new SaleService();
