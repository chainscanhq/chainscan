function ProductPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="border p-8">
        <img src="/mock-product.jpg" alt="Mock Product" className="w-64 h-64" />
        <p className="mt-4 text-white">Scan this product's QR code</p>
      </div>
    </div>
  );
}

export default ProductPage;