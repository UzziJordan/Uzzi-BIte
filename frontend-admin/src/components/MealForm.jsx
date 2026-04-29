import React, { useEffect, useState } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";

const MealForm = ({ onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });

  // PREFILL FOR EDIT
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[500px] rounded-2xl shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-[18px] font-semibold">
            {initialData ? "Edit Meal" : "Add New Meal"}
          </h2>

          <FiX
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-black"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6">

          <div className="flex gap-4">

            {/* IMAGE */}
            <div className="w-[45%] flex flex-col gap-2">
              <p className="text-[13px] text-gray-500">Upload Image</p>

              <label className="border rounded-xl h-[150px] flex items-center justify-center cursor-pointer overflow-hidden">

                {form.image ? (
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FiUploadCloud size={28} />
                    <p className="text-[12px] mt-1">
                      Click or drag image
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                name="image"
                placeholder="Or paste image URL"
                value={form.image}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 text-[13px]"
              />
            </div>

            {/* FIELDS */}
            <div className="flex-1 flex flex-col gap-4">

              <div>
                <p className="text-[13px] text-gray-500">Meal Name</p>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <p className="text-[13px] text-gray-500">Category</p>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <p className="text-[13px] text-gray-500">Price (₦)</p>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#E63946] text-white rounded-lg"
            >
              Save Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealForm;