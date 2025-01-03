import React from "react";

// Icons & Translations for status
const statusIcons = {
  Pending: "⏳",
  Ongoing: "⚙️",
  Completed: "✅",
  Cancelled: "❌",
};

const statusTranslations = {
  Pending: "I kö",
  Ongoing: "Pågående",
  Completed: "Klar",
  Cancelled: "Avbruten",
};

// Sorting orders
const statusOrders = [
  ["Pending", "Ongoing", "Completed", "Cancelled"],
  ["Ongoing", "Pending", "Completed", "Cancelled"],
  ["Completed", "Pending", "Ongoing", "Cancelled"],
  ["Cancelled", "Pending", "Ongoing", "Completed"],
];

// Status Component
const Status = ({ status, isSorting, statusSortIndex, onSort }) => {
  const getIcon = () => {
    if (isSorting) {
      return statusIcons[statusOrders[statusSortIndex][0]];
    }
    return statusIcons[status] || "";
  };

  return (
    <span
      onClick={isSorting ? onSort : null}
      style={isSorting ? { cursor: "pointer" } : {}}
      title={statusTranslations[status] || status}
    >
      {getIcon()} {isSorting ? "" : statusTranslations[status]}
    </span>
  );
};

// Sort matters based on status
export const sortMattersByStatus = (matters, statusSortIndex) => {
  const customOrder = statusOrders[statusSortIndex];
  return [...matters].sort((a, b) => {
    const indexA = customOrder.indexOf(a.status);
    const indexB = customOrder.indexOf(b.status);
    return indexA - indexB;
  });
};

// Handle filter and sorting
export const processMatters = ({
  rawMatters,
  statusSortIndex,
  lastClicked,
  titleSortAscending,
}) => {
  let sorted = [...rawMatters];

  if (lastClicked === "status") {
    sorted = sortMattersByStatus(sorted, statusSortIndex);
  } else {
    sorted.sort((a, b) => {
      if (a.title < b.title) return titleSortAscending ? -1 : 1;
      if (a.title > b.title) return titleSortAscending ? 1 : -1;
      return 0;
    });
  }

  return sorted;
};

export default Status;
