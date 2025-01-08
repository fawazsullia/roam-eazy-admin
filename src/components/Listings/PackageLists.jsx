import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Pagination, Badge } from "react-bootstrap";
import dayjs from "dayjs";

const PackageList = ({ packages, totalPackages, limit, skip, onPageChange, openAddListing }) => {
  const [filters, setFilters] = useState({ search: "", category: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const totalPages = Math.ceil(totalPackages / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <Container>
      {/* Filter Bar */}
      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  as="select"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="category1">Category 1</option>
                  <option value="category2">Category 2</option>
                </Form.Control>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={() => openAddListing()}>Create Listing</Button>
        </Col>
      </Row>

      {/* Package List */}
      <Row>
        {packages.map((pkg, index) => (
          <Col key={index} md={12} className="mb-3">
            <Card>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title>
                      <strong>{pkg.title || "Untitled Package"}</strong>
                    </Card.Title>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Card.Text>
                      <Badge
                        bg={
                          pkg.listingType === "active"
                            ? "success"
                            : pkg.listingType === "inactive"
                              ? "danger"
                              : "secondary"
                        }
                      >
                        {pkg.listingType}
                      </Badge>
                      {pkg.isFeatured && (
                        <Badge bg="warning" text="dark" className="ms-2">
                          Featured
                        </Badge>
                      )}
                    </Card.Text>
                    <Card.Text>
                      <strong>Budget:</strong> ${pkg.basePrice || 0} - ${pkg.basePriceSingle || "Unlimited"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Flight Included:</strong> {pkg.isFlightIncluded ? "Yes" : "No"}
                    </Card.Text>
                  </Col>
                  <Col md={6}>
                    <Card.Text>
                      <strong>Nights:</strong> {pkg.numberOfNights || "N/A"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Dates:</strong> {dayjs(pkg.startDate).format("DD MMM YYYY") || "N/A"} - {dayjs(pkg.endDate).format("DD MMM YYYY") || "N/A"}
                    </Card.Text>
                    {pkg.isTopPackage && (
                      <Card.Text>
                        <Badge bg="primary">Top Package</Badge>
                      </Card.Text>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Row>
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange((currentPage - 2) * limit)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx}
                active={idx + 1 === currentPage}
                onClick={() => handlePageChange(idx * limit)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage * limit)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange((totalPages - 1) * limit)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default PackageList;
