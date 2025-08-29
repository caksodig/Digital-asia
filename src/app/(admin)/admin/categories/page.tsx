// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { categoriesApi } from "@/lib/api";
// import {
//   categorySchema,
//   type CategoryFormData,
// } from "@/lib/validation-schemas";
// import type { Category, ApiError } from "@/lib/types";

// export default function AdminCategoryPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string>("");

//   const addForm = useForm<CategoryFormData>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: { name: "" },
//   });

//   const editForm = useForm<CategoryFormData>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: { name: "" },
//   });

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       setIsLoading(true);
//       setError("");
//       const data = await categoriesApi.getAll();
//       setCategories(data);
//     } catch (err) {
//       const apiError = err as ApiError;
//       setError(apiError.message || "Failed to load categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredCategories = categories.filter((category) =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddCategory = async (data: CategoryFormData) => {
//     try {
//       const newCategory = await categoriesApi.create({ name: data.name });
//       setCategories([...categories, newCategory]);
//       addForm.reset();
//       setIsAddDialogOpen(false);
//     } catch (err) {
//       const apiError = err as ApiError;
//       addForm.setError("name", {
//         message: apiError.message || "Failed to create category",
//       });
//     }
//   };

//   const handleEditCategory = async (data: CategoryFormData) => {
//     if (!editingCategory) return;

//     try {
//       const updatedCategory = await categoriesApi.update(editingCategory.id, {
//         name: data.name,
//       });
//       setCategories(
//         categories.map((cat) =>
//           cat.id === editingCategory.id ? updatedCategory : cat
//         )
//       );
//       editForm.reset();
//       setEditingCategory(null);
//       setIsEditDialogOpen(false);
//     } catch (err) {
//       const apiError = err as ApiError;
//       editForm.setError("name", {
//         message: apiError.message || "Failed to update category",
//       });
//     }
//   };

//   const handleDeleteCategory = async (id: string) => {
//     try {
//       await categoriesApi.delete(id);
//       setCategories(categories.filter((cat) => cat.id !== id));
//     } catch (err) {
//       const apiError = err as ApiError;
//       setError(apiError.message || "Failed to delete category");
//     }
//   };

//   const openEditDialog = (category: Category) => {
//     setEditingCategory(category);
//     editForm.setValue("name", category.name);
//     setIsEditDialogOpen(true);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-96">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900 mb-2">Category</h1>
//         <p className="text-gray-600">Total Category : {categories.length}</p>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//       )}

//       {/* Search and Add Category */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             placeholder="Search Category"
//             className="pl-10 w-64"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Add Category
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Category</DialogTitle>
//             </DialogHeader>
//             <form
//               onSubmit={addForm.handleSubmit(handleAddCategory)}
//               className="space-y-4 py-4"
//             >
//               <div>
//                 <Label htmlFor="categoryName">Category Name</Label>
//                 <Input
//                   id="categoryName"
//                   {...addForm.register("name")}
//                   placeholder="Enter category name"
//                   className="mt-1"
//                   disabled={addForm.formState.isSubmitting}
//                 />
//                 {addForm.formState.errors.name && (
//                   <p className="text-sm text-red-600 mt-1">
//                     {addForm.formState.errors.name.message}
//                   </p>
//                 )}
//               </div>
//               <div className="flex justify-end gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsAddDialogOpen(false)}
//                   disabled={addForm.formState.isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="bg-blue-600 hover:bg-blue-700"
//                   disabled={addForm.formState.isSubmitting}
//                 >
//                   {addForm.formState.isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Adding...
//                     </>
//                   ) : (
//                     "Add Category"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Categories Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
//           <div>Category</div>
//           <div>Created at</div>
//           <div>Action</div>
//         </div>

//         {filteredCategories.map((category) => (
//           <div
//             key={category.id}
//             className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
//           >
//             <div>
//               <span className="font-medium text-gray-900">{category.name}</span>
//             </div>
//             <div>
//               <span className="text-sm text-gray-600">
//                 {formatDate(category.createdAt)}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-blue-600 hover:text-blue-700"
//                 onClick={() => openEditDialog(category)}
//               >
//                 <Edit className="w-4 h-4 mr-1" />
//                 Edit
//               </Button>

//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     Delete
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Delete Category</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       Are you sure you want to delete the category "
//                       {category.name}"? This action cannot be undone.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={() => handleDeleteCategory(category.id)}
//                       className="bg-red-600 hover:bg-red-700"
//                     >
//                       Delete
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           </div>
//         ))}

//         {filteredCategories.length === 0 && (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm
//               ? `No categories found matching "${searchTerm}"`
//               : "No categories found"}
//           </div>
//         )}
//       </div>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Category</DialogTitle>
//           </DialogHeader>
//           <form
//             onSubmit={editForm.handleSubmit(handleEditCategory)}
//             className="space-y-4 py-4"
//           >
//             <div>
//               <Label htmlFor="editCategoryName">Category Name</Label>
//               <Input
//                 id="editCategoryName"
//                 {...editForm.register("name")}
//                 placeholder="Enter category name"
//                 className="mt-1"
//                 disabled={editForm.formState.isSubmitting}
//               />
//               {editForm.formState.errors.name && (
//                 <p className="text-sm text-red-600 mt-1">
//                   {editForm.formState.errors.name.message}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsEditDialogOpen(false)}
//                 disabled={editForm.formState.isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700"
//                 disabled={editForm.formState.isSubmitting}
//               >
//                 {editForm.formState.isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Pagination */}
//       <div className="flex items-center justify-center gap-2 mt-6">
//         <Button variant="ghost" size="sm">
//           Previous
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="bg-blue-600 text-white hover:bg-blue-700"
//         >
//           1
//         </Button>
//         <Button variant="ghost" size="sm">
//           2
//         </Button>
//         <span className="text-gray-500">...</span>
//         <Button variant="ghost" size="sm">
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

import React from "react";

function page() {
  return <div>ini kategori</div>;
}

export default page;
