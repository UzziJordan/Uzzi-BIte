import React from "react";

const OrderCard = ({ order, onCancel, onAction }) => {
  const getStatusStyle = () => {
    switch (order.status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "preparing":
        return "bg-blue-100 text-blue-600";
      case "served":
        return "bg-green-100 text-green-600";
      default:
        return "";
    }
  };

  const getActionButton = () => {
    if (order.status === "pending") {
      return (
        <button
          onClick={() => onAction(order.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Start Preparing
        </button>
      );
    }

    if (order.status === "preparing") {
      return (
        <button
          onClick={() => onAction(order.id)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Mark as Served
        </button>
      );
    }

    return (
      <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed w-full">
        Completed
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8ECEF] shadow-sm w-70">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Table {order.table}</h2>

        <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle()}`}>
          {order.status}
        </span>
      </div>

      {/* ITEMS */}
      <div className="text-[14px] text-gray-600 space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <p>
              {item.name} x{item.qty}
            </p>
            <p>₦{item.price}</p>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between mt-4 font-semibold">
        <p>Total</p>
        <p>₦{order.total}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onCancel(order.id)}
          className="border border-red-400 text-red-500 px-3 py-2 rounded-lg w-full"
        >
          Cancel Order
        </button>

        {getActionButton()}
      </div>
    </div>
  );
};

export default OrderCard;