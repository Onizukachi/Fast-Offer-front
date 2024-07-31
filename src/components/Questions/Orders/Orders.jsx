import { Select, SelectItem } from "@nextui-org/react";
import PropTypes from "prop-types";

const ORDER_OPTIONS = [
  { key: "desc", label: "По возрастанию" },
  { key: "asc", label: "По убыванию" },
];

const Orders = ({isLoading, sortField, sortOrder, handleSortingChange}) => {
  return (
    <>
      <Select
        isDisabled={isLoading}
        label="Сортировать по дате"
        defaultSelectedKeys={[sortField === "date" && sortOrder]}
        selectedKeys={[sortField === "date" && sortOrder]}
        labelPlacement="outside"
        placeholder="Направление"
        className="max-w-44"
        disableSelectorIconRotation
        onChange={(e) => handleSortingChange("date", e.target.value)}
      >
        {ORDER_OPTIONS.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </Select>
      <Select
        isDisabled={isLoading}
        label="Сортировать по популярности"
        selectedKeys={[sortField === "popular" && sortOrder]}
        defaultSelectedKeys={[sortField === "popular" && sortOrder]}
        labelPlacement="outside"
        placeholder="Направление"
        className="max-w-56"
        disableSelectorIconRotation
        onChange={(e) => handleSortingChange("popular", e.target.value)}
      >
        {ORDER_OPTIONS.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </Select>
    </>
  );
};

Orders.propTypes = {
  isLoading: PropTypes.bool,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
  handleSortingChange: PropTypes.func,
};

export default Orders;
