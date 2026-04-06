"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, 
  Loader2, Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  images: string | string[];
  skinTypeTags: string | string[];
  problemTags: string | string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    images: [] as string[],
    skinTypeTags: [] as string[],
    problemTags: [] as string[],
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products?search=${search}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct 
      ? `/api/admin/products/${editingProduct.id}` 
      : "/api/admin/products";
    const method = editingProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchProducts();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
  };

  const resetForm = () => {
    setFormData({
      name: "", price: "", category: "", stock: "", 
      description: "", images: [], skinTypeTags: [], problemTags: []
    });
    setEditingProduct(null);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
      skinTypeTags: typeof product.skinTypeTags === "string" ? JSON.parse(product.skinTypeTags) : product.skinTypeTags,
      problemTags: typeof product.problemTags === "string" ? JSON.parse(product.problemTags) : product.problemTags,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pastel-primary">Products</h1>
          <p className="text-pastel-primary/60 text-sm">Manage your inventory and product details.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-soft border border-pastel-secondary/5 overflow-hidden">
        <div className="p-6 border-b border-pastel-bg flex gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-primary/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-12 pr-4 py-3 bg-pastel-bg rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pastel-bg/50 text-pastel-primary/40 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pastel-bg">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pastel-primary mx-auto" />
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} className="group hover:bg-pastel-bg/30 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pastel-card flex items-center justify-center text-pastel-primary overflow-hidden">
                        <ImageIcon className="w-5 h-5 opacity-20" />
                      </div>
                      <span className="font-bold text-pastel-primary text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-pastel-primary/60">{p.category}</td>
                  <td className="px-8 py-4 font-bold text-pastel-primary text-sm">${p.price.toFixed(2)}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock < 10 ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-pastel-bg rounded-lg text-pastel-primary/40 hover:text-pastel-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-pastel-primary/40 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-pastel-primary/40 uppercase">Name</label>
              <input 
                required 
                className="w-full p-3 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-pastel-primary/40 uppercase">Category</label>
              <input 
                required 
                className="w-full p-3 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-pastel-primary/40 uppercase">Price ($)</label>
              <input 
                type="number" step="0.01" required 
                className="w-full p-3 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-pastel-primary/40 uppercase">Stock</label>
              <input 
                type="number" required 
                className="w-full p-3 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-pastel-primary/40 uppercase">Description</label>
            <textarea 
              rows={3} required 
              className="w-full p-3 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-pastel-primary/40 uppercase">Image URL (one per line)</label>
            <textarea 
              rows={2} 
              className="w-full p-3 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary resize-none"
              placeholder="https://image..."
              value={formData.images.join("\n")}
              onChange={(e) => setFormData({ ...formData, images: e.target.value.split("\n").filter(i => i) })}
            />
          </div>
          <Button type="submit" className="w-full h-14 text-lg">
            {editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export const dynamic = 'force-dynamic';
