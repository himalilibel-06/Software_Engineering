import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function EditAsset() {
  const location = useLocation();
  const asset = location.state?.asset;
  const [formData, setFormData] = useState(asset);

  if (!asset) {
    return <h2>No Asset Found</h2>;
  }
 const handleSave = () => {
  alert("Save button clicked!");
  console.log("Updated Asset:", formData);
};
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Asset</h1>

      <div className="space-y-4">

        <div>
          <label>Asset Name</label>
          <input
  type="text"
  value={formData.name}
  onChange={(e) =>
    setFormData({
      ...formData,
      name: e.target.value,
    })
  }
  className="border p-2 w-full rounded"
/>
        </div>

        <div>
          <label>Location</label>
          <input
  type="text"
  value={formData.location}
  onChange={(e) =>
    setFormData({
      ...formData,
      location: e.target.value,
    })
  }
  className="border p-2 w-full rounded"
/>
        </div>

        <div>
          <label>Status</label>
          <input
  type="text"
  value={formData.status}
  onChange={(e) =>
    setFormData({
      ...formData,
      status: e.target.value,
    })
  }
  className="border p-2 w-full rounded"
/>
        </div>

        <button
  onClick={handleSave}
  className="bg-blue-600 text-white px-5 py-2 rounded"
>
  Save Changes
</button>

      </div>
    </div>
  );
}