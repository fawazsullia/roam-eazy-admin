import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, Button } from 'antd';
import { axiosInstance } from 'utils/axios.util';

const { Sider, Content } = Layout;

const PlaceList = () => {
    const [countries, setCountries] = useState([]);
    const [places, setPlaces] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch countries from API
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.post('/api/place/get-destination', {
                    limit: 100,
                    offset: 0,
                    type: "country"
                });
                setCountries(response.data);
                if (response.data.length > 0) {
                    setSelectedCountry(response.data[0].placeId);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        console.log('Selected country:', selectedCountry);
        if (selectedCountry) {
            // Fetch places for the selected country
            const fetchPlaces = async () => {
                setLoading(true);
                try {
                    const response = await axiosInstance.post(`/api/place/get-destination`, {
                        limit: 100,
                        offset: 0,
                        type: "city",
                        country: selectedCountry
                    });
                    setPlaces(response.data);
                } catch (error) {
                    console.error('Error fetching places:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPlaces();
        }
    }, [selectedCountry]);

    const handleMenuClick = ({ key }) => {
        setSelectedCountry(key);
    };

    return (
        <>
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <Button >Add Place</Button>
            </div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider theme="light" width={200}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedCountry]}
                        onClick={handleMenuClick}
                        style={{ height: '100%' }}
                    >
                        {countries.map((country) => (
                            <Menu.Item key={country.placeId} onClick={() => setSelectedCountry(country.placeId)}>{country.name}</Menu.Item>
                        ))}
                    </Menu>
                </Sider>

                <Layout>
                    <Content style={{ padding: '24px', background: '#fff' }}>
                        {loading ? (
                            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
                        ) : (
                            <Row gutter={[16, 16]}>
                                {places.map((place) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={place.id}>
                                        <Card title={place.name} hoverable>
                                            <p>{place.description}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default PlaceList;
