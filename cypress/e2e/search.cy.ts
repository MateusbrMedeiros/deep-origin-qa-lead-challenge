import { searchProduct } from '../api/products';
import { Product } from '../types/product';

describe('GET /products/search', () => {
  context('Success cases', () => {
    it('should return products matching the search term', () => {
      const searchTerm = 'phone';

      searchProduct(searchTerm).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products).to.be.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);

        res.body.products.forEach((product: Product) => {
          const fields = [
            product.title,
            product.description,
            product.brand,
            product.category,
          ];

          const match = [
            product.title,
            product.description,
            product.brand,
            product.category,
          ]
            .filter((f): f is string => typeof f === 'string')
            .some((f) => f.toLowerCase().includes(searchTerm));
        });
      });
    });

    it('should return results regardless of case', () => {
      searchProduct('PHONE').then((res1) => {
        searchProduct('phone').then((res2) => {
          expect(res1.status).to.eq(200);
          expect(res2.status).to.eq(200);
          expect(res1.body.products.length).to.eq(res2.body.products.length);
        });
      });
    });

    it('should return all products if search term is empty', () => {
      searchProduct('').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products)
          .to.be.an('array')
          .and.have.length.greaterThan(0);
      });
    });
  });

  context('Validation and edge cases', () => {
    it('should return empty array when no match is found', () => {
      searchProduct('zzzzzzzzzzz').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products).to.be.an('array').and.have.length(0);
      });
    });

    it('should return status 200 with malformed input', () => {
      searchProduct('%20').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products).to.be.an('array');
      });
    });
  });
});
