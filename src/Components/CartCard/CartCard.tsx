import React, { useEffect, useState } from "react";
import "./CartCard.scss";
import { Button, Card, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteCartItems, updateQuantityCart } from "../../Redux/Action/Action";
import { toast } from "react-toastify";

function CartCard(Props: any) {
  const dispatch = useDispatch();
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [value, setValue] = useState(3);
  const [count, setCount] = useState<number>(Props.quantity || 0);
  const [totalconst, settotalConst] = useState(Props.totalQuantity);

  const increment = () => {
    let temp = count + 1;

    if (totalconst - 1 >= 1) {
      setCount(temp);
      settotalConst((prev: any) => prev - 1);
    } else {
      toast.error("Oops! not enough quantity.");
    }
  };

  const decrement = () => {
    let temp = count - 1;

    if (temp >= 1) {
      setCount(temp);
      settotalConst((prev: any) => prev + 1);
    } else {
      dispatch(deleteCartItems(Props.id));
    }
  };

  const handleChange = (value: any) => {};
  const confirm = (id: any) => {
    dispatch(deleteCartItems(id));
  };
  const cancel = (e: React.MouseEvent<HTMLElement>) => {};

  useEffect(() => {
    let temp = {
      id: Props.id,
      count: count,
    };
    dispatch(updateQuantityCart(temp));
  }, [count]);

  return (
    <div className="CartCard-wrapper">
      <Card className="CartCard">
        <div className="CartCart-left">
          <img
            src={`${process.env.REACT_APP_BASEURL}/${Props.img}`}
            alt=""
            className="CartCard-img"
            height='100'
          />
        </div>
        <div className="CartCart-right">
          <h3>{Props.title}</h3>
          <p>{Props.description}</p>
          <h4>$ {Props.price}</h4>

          <div className="count-delete">
            <div>
              <Button onClick={decrement}>-</Button>
              {count}
              <Button onClick={increment}>+</Button>
            </div>
            <div className="delete">
              <Popconfirm
                title="Delete this item"
                description="Are you sure to delete this item from cart?"
                onConfirm={() => confirm(Props.id)}
                onCancel={() => cancel}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined />
              </Popconfirm>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CartCard;
