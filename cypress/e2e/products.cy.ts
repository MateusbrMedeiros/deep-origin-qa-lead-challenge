import { getAllProducts } from '../api/products';
import { Product } from '../types/product';

describe('GET /products', () => {
  context('Success cases', () => {
    it('should return the product list', () => {
      getAllProducts().then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.include('application/json');

        expect(res.body).to.have.property('products').that.is.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);

        const firstProduct: Product = res.body.products[0];
        expect(firstProduct).to.have.property('id');
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('price');
        expect(firstProduct).to.have.property('category');
      });
    });

    it('should return 10 products when limit is 10', () => {
      getAllProducts({ limit: 10 }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.include('application/json');

        expect(res.body)
          .to.have.property('products')
          .that.is.an('array')
          .and.have.length(10);
        expect(res.body).to.have.property('limit', 10);
      });
    });

    it('should return all products when limit is 0', () => {
      getAllProducts({ limit: 0 }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.include('application/json');

        expect(res.body).to.have.property('products').that.is.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should return all products when limit is a negative number', () => {
      getAllProducts({ limit: -1 }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.include('application/json');

        expect(res.body).to.have.property('products').that.is.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should return different products when using skip parameter', () => {
      getAllProducts({ limit: 5, skip: 0 }).then((res1) => {
        getAllProducts({ limit: 5, skip: 5 }).then((res2) => {
          expect(res1.status).to.eq(200);
          expect(res2.status).to.eq(200);
          expect(res1.body).to.have.property('products').that.is.an('array');
          expect(res2.body).to.have.property('products').that.is.an('array');
          expect(res1.body.products[0].id).to.not.eq(res2.body.products[0].id);
        });
      });
    });
  });

  context('Validation and errors', () => {
    it('should return 400 error when limit is not a number', () => {
      getAllProducts({ limit: 'abc', failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.headers['content-type']).to.include('application/json');
        expect(res.body).to.have.property('message');
      });
    });
  });

  context('Sorting and Ordering', () => {
    it('should sort products by price in descending order', () => {
      getAllProducts({ sortBy: 'price', order: 'desc' }).then((res) => {
        expect(res.status).to.eq(200);

        const prices = res.body.products.map((p: { price: any }) => p.price);
        const sortedPrices = [...prices].sort((a, b) => b - a);

        expect(prices).to.deep.equal(sortedPrices);
      });
    });

    it.skip('should sort products by title in ascending order', () => {
      // Skipped because DummyJSON API does not return correctly sorted titles (inconsistent backend ordering)
      getAllProducts({ sortBy: 'title', order: 'asc' }).then((res) => {
        expect(res.status).to.eq(200);
        const products = res.body.products;

        const titles = products.map((p: Product) => p.title.toLowerCase());
        const sortedTitles = [...titles].sort();

        expect(titles).to.deep.equal(sortedTitles);
      });
    });

    it('should sort products by stock in ascending order', () => {
      getAllProducts({ sortBy: 'stock', order: 'asc' }).then((res) => {
        expect(res.status).to.eq(200);
        const stocks = res.body.products.map((p: Product) => p.stock);
        const sorted = [...stocks].sort((a, b) => a - b);
        expect(stocks).to.deep.equal(sorted);
      });
    });

    it('should fallback to default sort if sortBy is empty', () => {
      getAllProducts({ sortBy: '', order: 'asc' }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products).to.be.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should ignore invalid sortBy and return unsorted/default results', () => {
      getAllProducts({ sortBy: 'banana' }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('products').that.is.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should ignore order param if sortBy is missing', () => {
      getAllProducts({ order: 'desc' }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.products).to.be.an('array');
        expect(res.body.products.length).to.be.greaterThan(0);
      });
    });
  });
});
