import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Checkbox, DatePicker, Button, Modal, InputNumber, Upload, Space, Row, Col } from 'antd';
import axios from 'axios';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Styles from "./CreateListing.module.css";
import "antd/dist/reset.css";
import { Meals } from 'constants/meals.constant';
import "../../index.scss"

const { Option } = Select;
const { TextArea } = Input;

const CreateListingForm = ({ show, setShowAddListing }) => {
    const [form] = Form.useForm();
    const [from, setFrom] = useState([]);
    const [to, setTo] = useState([]);
    const [selectedTo, setSelectedTo] = useState(null);
    const [places, setPlaces] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        axios.post('/api/place/get-departing', { limit: 100, offset: 0 })
            .then(response => setFrom(response.data))
            .catch(error => console.error(error));

        axios.post('/api/place/get-destination', { limit: 100, offset: 0, type: "country" })
            .then(response => { setTo(response.data); setSelectedTo(response.data[0].placeId) })
            .catch(error => console.error(error));
        return () => {
            form.resetFields();
            setFrom([]);
            setTo([]);
            setSelectedTo(null);
            setPlaces([]);
            setSubmitLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTo) {
            axios.post('/api/place/get-destination', { limit: 100, offset: 0, country: selectedTo, type: "city" })
                .then(response => setPlaces(response.data))
                .catch(error => console.error(error));

        }
    }, [selectedTo]);

    const handleSubmit = async () => {
        setSubmitLoading(true);
        const formData = new FormData();

        const values = form.getFieldsValue();
        console.log(values, "values========================>");
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'files' && value[0]) {
                formData.append(key, value[0].originFileObj);
            } else if (key === 'itinerary') {
                value.forEach((item, index) => {
                    formData.append(`itinerary[${index}][day]`, item.day);
                    formData.append(`itinerary[${index}][title]`, item.title);
                    formData.append(`itinerary[${index}][description][0]`, item.description);
                });
            } else if (key === "termsAndConditions") {
                value.forEach((item, index) => {
                    formData.append(`termsAndConditions[${index}]`, item);
                });
            } else if(key === "mealsIncluded" && Array.isArray(value) && value.length) {
                value.forEach((meal, index) => {
                    formData.append(`mealsIncluded[${index}]`, meal);
                });
            } else if(key === "includedPlaces") {
                value.forEach((place, index) => {
                    formData.append(`includedPlaces[${index}]`, place);
                });
            } else if(key === "tags") {
                value?.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            } else {
                formData.append(key, value);
            }
        });

        try {
            await axios.post('/api/listing/create-listing', formData);
            setShowAddListing(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const closeForm = () => {
        setShowAddListing(false);
        setSubmitLoading(false);
        form.resetFields();
    }

    return (
        <Modal
            title="Create Listing"
            visible={show}
            onCancel={closeForm}
            footer={null}
            className={Styles.modal}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    airPortTransfers: 'ARRIVAL_ONLY',
                    travelInsurance: true,
                    airTickets: false,
                    tourGuide: false,
                }}
            >
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                    <TextArea placeholder="Enter title" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="from" label="From" rules={[{ required: true, message: 'Please select a departure location' }]}>
                            <Select placeholder="Select departing location">
                                {from.map(location => (
                                    <Option key={location.placeId} value={location.placeId}>{location.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="to" label="To" rules={[{ required: true, message: 'Please select a destination' }]}>
                            <Select placeholder="Select destination" value={selectedTo} onChange={(e) => setSelectedTo(e)}>
                                {to.map(location => (
                                    <Option key={location.placeId} value={location.placeId}>{location.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="includedPlaces"
                    label="Included Places"
                    rules={[{ required: true, message: 'Please select or add included places!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select or add included places"
                        allowClear
                        options={places.map(place => ({ label: place.name, value: place.placeId }))}
                    />
                </Form.Item>

                <Form.Item name="overview" label="Overview" rules={[{ required: true, message: 'Overview is required' }]}>
                    <TextArea placeholder="Enter Ovrview" />
                </Form.Item>

                <Form.Item name="numberOfNights" label="Number of Nights" rules={[{ required: true, message: 'Please enter the number of nights' }]}>
                    <InputNumber min={1} placeholder="Enter number of nights" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="mealsIncluded" label="Meals Included">
                    <Checkbox.Group>
                        <div direction="vertical" className={Styles.mealsContainer}>
                            {Object.values(Meals).map(meal => (
                                <Checkbox key={meal} value={meal}>{meal}</Checkbox>
                            ))}
                        </div>
                    </Checkbox.Group>
                </Form.Item>

                <p>Inclusions</p>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="travelInsurance" valuePropName="checked">
                            <Checkbox defaultChecked>Include Travel Insurance</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="visa" valuePropName="checked">
                            <Checkbox defaultChecked>Include Visa</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="airTickets" valuePropName="checked">
                            <Checkbox>Include Air Tickets</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="tourGuide" valuePropName="checked">
                            <Checkbox>Include Tour Guide</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="airPortTransfers" label="Airport Transfers">
                    <Select>
                        <Option value="ARRIVAL_ONLY">Arrival Only</Option>
                        <Option value="DEPARTURE_ONLY">Departure Only</Option>
                        <Option value="BOTH">Both</Option>
                    </Select>
                </Form.Item>

                <Form.List name="itinerary" initialValue={[{ day: '', title: '', description: '' }]}>
                    {(fields, { add, remove }) => (
                        <>
                            <h4>Itinerary</h4>
                            {fields.map(({ key, name, fieldKey }) => (
                                <>
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <Form.Item name={[name, 'day']} fieldKey={[fieldKey, 'day']} rules={[{ required: true, message: 'Day is required' }]}>
                                                <InputNumber min={1} placeholder="Day" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={16}>
                                            <Form.Item name={[name, 'title']} fieldKey={[fieldKey, 'title']} rules={[{ required: true, message: 'Title is required' }]}>
                                                <Input placeholder="Title" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={20}>
                                            <Form.Item name={[name, 'description']} fieldKey={[fieldKey, 'description']} rules={[{ required: true, message: 'Description is required' }]}>
                                                <TextArea placeholder="Description" rows={1} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="dashed" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />} />
                                        </Col>
                                    </Row>

                                </>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Itinerary
                            </Button>
                        </>
                    )}
                </Form.List>
                <br />
                <br />

                <Form.Item name="tags" label="Tags">
                    <TextArea placeholder="Enter tags, separated by commas" rows={2} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'End date is required' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="basePrice" label="Base Price (Twin Sharing)" rules={[{ required: true, message: 'Base price is required' }]}>
                            <InputNumber min={0} placeholder="Enter base price" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="basePriceSingle" label="Base Price (Single)" rules={[{ required: true, message: 'Base price is required' }]}>
                            <InputNumber min={0} placeholder="Enter base price" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.List name="termsAndConditions" initialValue={[]}>
                    {(fields, { add, remove }) => (
                        <>
                            <h4>Terms and Conditions</h4>
                            {fields.map(({ name }) => (
                                <>
                                    <Row gutter={16}>
                                        <Col span={20}>
                                            <Form.Item name={[name]}>
                                                <TextArea placeholder="Terms" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="dashed" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />} />
                                        </Col>
                                    </Row>
                                </>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add
                            </Button>
                        </>
                    )}
                </Form.List>
                <br />
                <br />
                <Form.Item name="files" required={true} label="License Upload" valuePropName="fileList" getValueFromEvent={e => e && e.fileList}>
                    <Upload name="file" beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload File</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={submitLoading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateListingForm;