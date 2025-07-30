import { getProductsByCategory } from '../api/products';
import { Product } from '../types/product';

describe('GET /products/category/:category', () => {
  const validCategory = 'smartphones';
  const invalidCategory = 'not-valid-category';

  context('Success cases', () => {
    it(`should return products from the category "${validCategory}"`, () => {
      getProductsByCategory(validCategory).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('products').that.is.an('array').and
          .not.empty;

        res.body.products.forEach((product: Product) => {
          expect(product).to.have.property('category');
          expect(product.category?.toLowerCase()).to.eq(validCategory);
        });
      });
    });

    it('should return the same results regardless of casing', () => {
      getProductsByCategory('SmartPhones').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products).to.be.an('array').and.not.empty;

        res.body.products.forEach((product: Product) => {
          expect(product.category?.toLowerCase()).to.eq(validCategory);
        });
      });
    });

    it('should include required product fields', () => {
      getProductsByCategory(validCategory).then((res) => {
        expect(res.status).to.eq(200);
        const product: Product = res.body.products[0];
        expect(product).to.include.all.keys('id', 'title', 'price', 'category');
      });
    });

    it('should return consistent results for the same category', () => {
      getProductsByCategory(validCategory).then((res1) => {
        getProductsByCategory(validCategory).then((res2) => {
          expect(res1.status).to.eq(200);
          expect(res2.status).to.eq(200);
          expect(res1.body.products).to.deep.eq(res2.body.products);
        });
      });
    });
  });

  context('Validation and error cases', () => {
    it('should return empty or error for invalid category', () => {
      getProductsByCategory(invalidCategory, { failOnStatusCode: false }).then(
        (res) => {
          expect(res.status).to.be.oneOf([200, 404]);

          if (res.status === 200) {
            expect(res.body).to.have.property('products').that.is.an('array')
              .and.empty;
          } else {
            expect(res.body).to.have.property('message');
          }
        },
      );
    });

    it('should return empty list for category with URL-encoded special characters', () => {
      getProductsByCategory('laptops%20and%20devices', {
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('products').that.is.an('array').and
          .empty;
        expect(res.body).to.have.property('total', 0);
      });
    });

    it('should return empty list for category with unencoded space', () => {
      getProductsByCategory('mobile accessories', {
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('products').that.is.an('array').and
          .empty;
        expect(res.body).to.have.property('total', 0);
      });
    });

    it('should return 200 and empty product list for numeric category ID', () => {
      getProductsByCategory('12345', { failOnStatusCode: false }).then(
        (res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property('products').that.is.an('array').and
            .empty;
          expect(res.body).to.have.property('total', 0);
        },
      );
    });
  });
});
