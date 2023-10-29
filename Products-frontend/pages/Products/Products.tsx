import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "./Pagination";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [validated, setValidated] = useState(false);
  const [validatedEdit, setValidatedEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddClose = () => setShowAdd(false);
  const handleAddShow = () => setShowAdd(true);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  const [editId, setEditId] = useState("");
  const [editProductId, setEditProductId] = useState("");
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [productsData, setProductsData] = useState([]);

  const getProductsData = () => {
    axios
      .get("http://localhost:5011/api/Product")
      .then((result) => {
        setProductsData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`http://localhost:5011/api/Product/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditBrand(result.data.brand);
        setEditPrice(result.data.price);
        setEditProductId(result.data.productID);
        setEditId(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?") === true) {
      axios
        .delete(`http://localhost:5011/api/Product/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Product has been deleted");
            getProductsData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = (event) => {
    const url = `http://localhost:5011/api/Product/${editId}`;
    const data = {
      id: editId,
      productId: editProductId,
      name: editName,
      brand: editBrand,
      price: editPrice,
    };
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidatedEdit(true);
    } else {
      axios
        .put(url, data)
        .then((result) => {
          handleClose();
          getProductsData();
          clear();
          toast.success("Product has been updated");
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const checkAlreadyExists = () => {
    return productsData.some((product) => product.productID === id);
  };

  const handleSave = (event) => {
    const url = "http://localhost:5011/api/Product";
    const data = {
      productId: id,
      name: name,
      brand: brand,
      price: price,
    };

    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    }
    if (checkAlreadyExists()) {
      toast.error("Product already exists");
    } else {
      axios
        .post(url, data)
        .then((result) => {
          toast.success("Product has been added");
          handleAddClose();
          getProductsData();
          clear();
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const clear = () => {
    setId("");
    setName("");
    setBrand("");
    setPrice("");
    setEditBrand("");
    setEditId("");
    setEditName("");
    setEditPrice("");
  };

  const filterOnSearch = () => {
    return productsData.filter((product) => {
      const searchTerm = search.toLowerCase();
      return (
        product.productID.toLowerCase().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.price.toString().toLowerCase().includes(searchTerm)
      );
    });
  };

  const filterProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterOnSearch().slice(startIndex, endIndex);
  };

  const filterProductsLength = () => {
    const filteredData = filterOnSearch();
    return filteredData.length;
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getProductsData();
  }, []);
  return (
    <Fragment>
      <ToastContainer />
      <Container className="p-5">
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Search Products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleAddShow}>
              Add Product
            </button>
          </Col>
        </Row>
        <br />
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterProducts().map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.productID}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.price}</td>
                  <td colSpan={2}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>{" "}
                    &nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filterProductsLength() / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </Container>
      <Modal show={showAdd} onHide={handleAddClose} size="lg">
        <Form noValidate validated={validated} onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>Add product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-4">
              <Form.Group as={Col} md="3" controlId="validationCustomId">
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustomName">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustomBrand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustomPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={show} onHide={handleClose} size="lg">
        <Form noValidate validated={validatedEdit} onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Modify product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-4">
              <Form.Group
                as={Col}
                md="3"
                controlId="validationCustomEditProductId"
              >
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  required
                  disabled
                  type="text"
                  placeholder="Product ID"
                  value={editProductId}
                  onChange={(e) => setEditProductId(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustomEditName">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustomEditBrand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product brand"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustomEditPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Product price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Products;
