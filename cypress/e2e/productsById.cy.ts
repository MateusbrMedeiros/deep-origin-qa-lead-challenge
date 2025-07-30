import { getProductById } from '../api/products';

describe('GET /products', () => {
  context('Get products by ID', () => {
    it('should return a product when used a valid ID', () => {
      getProductById(1).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.include('application/json');

        const product = res.body;
        expect(product).to.have.property('id', 1);
        expect(product).to.have.property('title');
        expect(product).to.have.property('price');
        expect(product).to.have.property('category');
      });
    });

    it('should return 404 for non-existent ID', () => {
      getProductById(99999, { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property('message');
      });
    });

    it('should return 404 for non-existent ID', () => {
      getProductById(0, { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property('message');
      });
    });

    it('should return 404 for non-existent ID', () => {
      getProductById(-1, { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property('message');
      });
    });

    it('should return error for invalid ID (string)', () => {
      getProductById('abc', { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([400, 404]);
        expect(res.body).to.have.property('message');
      });
    });
  });
});
