import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, message, Pagination } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  // Fetch companies from the API
  const fetchCompanies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/company?getDetail=true&skip=${(page - 1) * itemsPerPage}&limit=${itemsPerPage}`);
      setCompanies(response.data.companies);
      setTotalItems(response.data.total); // Assuming the API provides the total number of items
    } catch (error) {
      message.error('Failed to fetch companies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {companies.map((company) => (
              <Col xs={24} sm={12} md={8} lg={6} key={company._id}>
                <Card
                  hoverable
                  cover={
                    company.logo ? (
                      <img
                        alt={company.name}
                        src={company.logo}
                        style={{ height: 150, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 150,
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>No Logo</Text>
                      </div>
                    )
                  }
                >
                  <Title level={5}>{company.name}</Title>
                  <Text>{company.description}</Text>
                  <div style={{ marginTop: '10px' }}>
                    <Text strong>Email: </Text>{company.email}<br />
                    <Text strong>Phone: </Text>{company.phone}<br />
                    <Text strong>Address: </Text>{company.address}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            style={{ marginTop: '20px', textAlign: 'center' }}
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalItems}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Companies;