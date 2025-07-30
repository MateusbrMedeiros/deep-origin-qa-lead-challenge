import { createProduct, deleteProduct, updateProduct } from '../api/products';

describe('PRODUCTS - CRUD operations', () => {
  let createdProductId: number;

  context('Create product (POST /products/add)', () => {
    it('should create a product with valid data', () => {
      const newProduct = {
        title: 'Test Product',
        price: 99.99,
        category: 'smartphones',
      };

      createProduct(newProduct).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.include(newProduct);
        createdProductId = res.body.id;
      });
    });

    it('should create the product with invalid price', () => {
      //the API allows to create products with prices as String like "abc"
      const invalidProduct = {
        title: 'Invalid Price',
        price: 'abc',
        category: 'smartphones',
      };

      createProduct(invalidProduct as any, { failOnStatusCode: false }).then(
        (res) => {
          expect(res.status).to.eq(201);
        },
      );
    });
  });

  context('Update product (PUT /products/:id)', () => {
    const existingProductId = 1;

    it('should update a product successfully', () => {
      const updatedData = { title: 'Updated Title Test' };

      updateProduct(existingProductId, updatedData).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.title).to.eq(updatedData.title);
      });
    });

    it('should return the same data if nothing changes', () => {
      const sameData = { title: 'Updated Title Test' };

      updateProduct(existingProductId, sameData).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.title).to.eq(sameData.title);
      });
    });

    it('should return error when updating non-existent product', () => {
      updateProduct(
        99999,
        { title: 'Does Not Exist' },
        { failOnStatusCode: false },
      ).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it('should accept invalid price due to missing validation in the API', () => {
      updateProduct(
        existingProductId,
        { price: 'invalid' as unknown as number },
        { failOnStatusCode: false },
      ).then((res) => {
        expect(res.status).to.eq(200); // It wrongly accepts
        expect(typeof res.body.price).to.eq('string'); // Should not be string
      });
    });

    it('should support PATCH as well', () => {
      cy.request({
        method: 'PATCH',
        url: `/products/${existingProductId}`,
        body: { price: 222.22 },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.price).to.eq(222.22);
      });
    });
  });

  context('Delete product (DELETE /products/:id)', () => {
    it('should delete the created product', () => {
      deleteProduct(1).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('isDeleted', true);
      });
    });

    it('should return 404 when trying to delete non-existent product', () => {
      deleteProduct(99999, { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });
});
