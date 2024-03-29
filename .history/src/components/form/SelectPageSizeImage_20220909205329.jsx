import React, { useId } from "react";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import useDebouonce from "../../hooks/useDebouonce";
import { Input } from "antd";

import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const SelectStyles = styled.div`
  position: relative;
  width: 500px;
  .label {
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 50px;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 0px 10px;
    align-items: center;
    background: #fff;
    cursor: pointer;
    z-index: 11;
    position: relative;
  }
  .option {
    position: absolute;
    top: 100%;
    background: #fff;
    width: 100%;
    padding: 10px 5px;
    border-radius: 8px;
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014,
      0 9px 28px 8px #0000000d;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    max-height: 250px;
    overflow: auto;
  }
  .option.open {
    opacity: 1;
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: -10px;
    left: 0;
    height: 100% + 10px;
    background: #fff;
  }
  .page {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      margin: 0px 20px;
      font-size: 12px;
      cursor: pointer;
    }
    p {
      font-size: 12px;
      line-height: 12px;
    }
    margin-bottom: 10px;
  }
`;
const OptionStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  cursor: pointer;
  padding: 10px 0px;
  &.active {
    background-color: #e6f7ff;
  }
`;
const Option = ({ value, children, onClick, active, activeStyle }) => {
  return (
    <OptionStyle
      className={`item${active && " active"}`}
      onClick={() => onClick(value)}
      style={activeStyle}
    >
      {children}
    </OptionStyle>
  );
};
function SelectPageSizeImage({
  value,
  children,
  boxnotHidden = <p>boxnotHidden</p>,
  onSearch,
  onscroll,
  activeStyle,
  onClick,
  ...props
}) {
  console.log("children", children);
  const [open, setOpen] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const { value: debouncedValue } = useDebouonce(textSearch, 300);
  const nodeRef = useRef(null);
  const idSearch = useId();
  const notHiddenRef = useRef(null);
  useEffect(() => {
    function handleClickOutSide(e) {
      if (
        nodeRef.current &&
        !nodeRef.current.contains(e.target) &&
        notHiddenRef.current &&
        !notHiddenRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  const handleClick = (value) => {
    onClick(value);
  };
  const handleSearch = (e) => {
    setTextSearch(e.target.value);
  };
  const handleScroll = (e) => {
    onscroll(e.target.scrollTop);
  };
  return (
    <SelectStyles {...props}>
      <label
        className="label"
        onClick={() => setOpen(true)}
        ref={nodeRef}
        htmlFor={idSearch}
      >
        <Input
          placeholder="Tìm kiếm"
          bordered={false}
          value={open ? textSearch : value}
          onChange={handleSearch}
          id={idSearch}
        />
        <div className="icon">
          {open ? (
            <SearchOutlined style={{ color: "#00000073" }} />
          ) : (
            <CaretDownOutlined />
          )}
        </div>
      </label>
      <div className={`option ${open ? "open" : ""}`} onScroll={handleScroll}>
        <div className="box" ref={notHiddenRef}>
          {boxnotHidden}
        </div>
        {children.map((item, index) => (
          <Option
            value={item}
            active={item.id === value.id}
            activeStyle={activeStyle}
            onClick={handleClick}
            key={index}
          >
            <img src={item.url} alt={item.public_id} />
          </Option>
        ))}
      </div>
    </SelectStyles>
  );
}

export default SelectPageSizeImage;
