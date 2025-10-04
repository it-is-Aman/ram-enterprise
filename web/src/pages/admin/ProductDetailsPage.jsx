import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  StarIcon as StarOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { productsAPI } from '../../services';

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data || response);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error loading product data');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        navigate('/admin/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleStockUpdate = async () => {
    const newStock = prompt('Enter new stock quantity:', product.stock);
    if (newStock !== null && newStock !== product.stock.toString()) {
      try {
        await productsAPI.updateStock(id, parseInt(newStock));
        fetchProduct();
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('Error updating stock');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolid
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/products')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Product Details</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/admin/products/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-rose)] hover:bg-[var(--primary-rose)]/90"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Product
            </Link>
            
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square">
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {product.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.alt || product.name}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Images</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-lg text-gray-600">{product.category?.name}</p>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                {product.discount > 0 && (
                  <p className="text-lg text-green-600">{product.discount}% off</p>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-gray-700 mb-4">{product.description}</p>
            )}

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                Stock: {product.stock}
              </span>
              
              {product.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Featured
                </span>
              )}
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(product.averageRating)}
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleStockUpdate}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 text-sm font-medium"
              >
                Update Stock
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
            
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">SKU</dt>
                <dd className="text-sm text-gray-900">{product.sku || 'N/A'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">{product.category?.name || 'N/A'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="text-sm text-gray-900">₹{product.price.toLocaleString()}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Discount</dt>
                <dd className="text-sm text-gray-900">{product.discount}%</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Stock</dt>
                <dd className="text-sm text-gray-900">{product.stock} units</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">{product.isActive ? 'Active' : 'Inactive'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
