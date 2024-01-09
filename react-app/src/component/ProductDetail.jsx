import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

function ProductDetail() {
  const [product, setproduct] = useState();
  const [user, setuser] = useState();
  console.log(user, "userrrr")

  const p = useParams();
  console.log(p.productId);

  useEffect(() => {
    const url = "http://localhost:4002/get-product/" + p.productId;
    axios
      .get(url)
      .then((res) => {
        if (res.data.product) {
          setproduct(res.data.product);
        }
      })
      .catch((err) => {
        alert("server err.");
      });
  }, []);

  const   handleContact = (addedBy)=>{
    console.log('id',addedBy)
    const url = "http://localhost:4002/get-user/" + addedBy;
    axios
      .get(url)
      .then((res) => {
        if (res.data.user) {
          setuser(res.data.user);
        }
      })
      .catch((err) => {
        alert("server err.");
      });
  }


  return (
    <>
      <Header />
      PRODUCT DETAILS:
      <div>
        {product && (
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <img
                width="400px"
                height="200px"
                src={"http://localhost:4002/" + product.pimage}
                alt=""
              />
              {product.pimage2 && <img
                width="400px"
                height="200px"
                src={"http://localhost:4002/" + product.pimage2}
                alt=""
              />}
              <h5>Product Details: {product.pdesc}</h5>
            </div>
            <div>
              <h3 className="m-2">
                {product.pname} | {product.category}
              </h3>
              <h4 className="m-2">Age : {product.price}</h4>
              <p className="m-2 text-success">Desc : {product.pdesc}</p>
              
              {product.addedBy &&
                <button onClick={()=>handleContact(product.addedBy)}>SHOW CONTACT DETAILS</button>}
              {user && user.username && <h4>{user.username}</h4>}
              {user && user.email && <h4>{user.email}</h4>}
              {user && user.mobile && <h4>{user.mobile}</h4>}
              
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
