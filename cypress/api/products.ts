import { Product } from '../types/product';

type ProductQueryParams = {
  limit?: string | number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  failOnStatusCode?: boolean;
};

export const getAllProducts = (params: ProductQueryParams = {}) => {
  const { limit, skip, sortBy, order, failOnStatusCode } = params;
  const query = new URLSearchParams();

  if (limit !== undefined) query.append('limit', limit.toString());
  if (skip !== undefined) query.append('skip', skip.toString());
  if (sortBy) query.append('sortBy', sortBy);
  if (order) query.append('order', order);

  const url = query.toString() ? `/products?${query.toString()}` : '/products';

  return cy.request({
    method: 'GET',
    url,
    failOnStatusCode: failOnStatusCode ?? true,
  });
};

export const getProductById = (
  id: string | number,
  options: { failOnStatusCode?: boolean } = {},
) => {
  return cy.request({
    method: 'GET',
    url: `/products/${id}`,
    failOnStatusCode: options.failOnStatusCode ?? true,
  });
};
export const searchProduct = (query: string) =>
  cy.request(`/products/search?q=${query}`);

export const getSortedProducts = (sortBy: string, order: 'asc' | 'desc') =>
  cy.request(`/products?sortBy=${sortBy}&order=${order}`);

export const getAllCategories = () => cy.request('/products/categories');

export const getProductsByCategory = (
  category: string,
  options: { failOnStatusCode?: boolean } = {},
) => {
  return cy.request({
    method: 'GET',
    url: `/products/category/${category}`,
    failOnStatusCode: options.failOnStatusCode ?? true,
  });
};

export const getProductCategoryList = () =>
  cy.request('/products/category-list');

export const createProduct = (
  product: Product,
  options: { failOnStatusCode?: boolean } = {},
) => cy.request('POST', '/products/add', product);

export const updateProduct = (
  id: number,
  data: Partial<Product>,
  options: { failOnStatusCode?: boolean } = {},
) => {
  return cy.request({
    method: 'PUT',
    url: `/products/${id}`,
    body: data,
    failOnStatusCode: options.failOnStatusCode ?? true,
  });
};

export const deleteProduct = (
  id: number,
  options: { failOnStatusCode?: boolean } = {},
) => {
  return cy.request({
    method: 'DELETE',
    url: `/products/${id}`,
    failOnStatusCode: options.failOnStatusCode ?? true,
  });
};
