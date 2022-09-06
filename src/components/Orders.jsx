import { useMemo } from "react";
import useActions from "../hooks/useActions";
import useOrders from "../hooks/useOrders";
import usePrototypes from "../hooks/useProtoypes";

export default function Orders() {
  const orders = useOrders();
  const prototypes = usePrototypes();
  const { remove, removeAll } = useActions();
  const totalPrice = useMemo(() => {
    return orders
      .map((order) => {
        const { id, quantity } = order;
        const prototype = prototypes.find((p) => p.id === id);
        return prototype.price * quantity; // 각각 아이디를 찾아 프라이스를 수량만큼 곱해준다.
      })
      .reduce((l, r) => l + r, 0); // 각 항목에 대해서 더한다. 0은 초기값
  }, [orders, prototypes]); // 언제 다시 계산하는지? orders가 변하면 다시 맵을 돈다.(디펜더시)

  if (orders.length === 0) {
    return (
      <aside>
        <div className="empty">
          <div className="title">You don't have any orders.</div>
          <div className="subtitle">Clink on a + to add an order.</div>
        </div>
      </aside>
    );
  }

  return (
    <aside>
      <div className="order">
        <div className="body">
          {orders.map((order) => {
            const { id } = order;
            const prototype = prototypes.find((p) => p.id === id);
            const click = () => {
              remove(id);
            };
            return (
              <div className="item" key={id}>
                <div className="img">
                  <video src={prototype.thumbnail}></video>
                </div>
                <div className="content">
                  <p className="title">
                    {prototype.title} X {order.quantity}
                  </p>
                </div>
                <div className="action">
                  <p className="price">$ {prototype.price * order.quantity}</p>
                  <button className="btn btn--link" onClick={click}>
                    <i className="icon icon--cross"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="total">
          <hr />
          <div className="item">
            <div className="content">Total</div>
            <div className="action">
              <div className="price">$ {totalPrice}</div>
            </div>
            <button className="btn btn--link" onClick={removeAll}>
              <i className="icon icon--delete"></i>
            </button>
          </div>
          <button
            className="btn btn--secondary"
            style={{ width: "100%", margin: "20px 0 0 0" }}
          >Check out</button>
        </div>
      </div>
    </aside>
  );
}
