import { Spin } from "antd";
import axios from "axios";
import FullPageSpin from "components/FullPageSpin/FullPageSpin";
import CreateListingForm from "components/Listings/CreateListing";
import PackageList from "components/Listings/PackageLists";
import AdminPackageList from "core/packageList/PackageList";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { axiosInstance } from "utils/axios.util";

const Listings = () => {
    const auth = useSelector(state => state.auth);
    const [listings, setListings] = useState([]);
    const [totalPackages, setTotalPackages] = useState(0);
    const [skip, setSkip] = useState(0);
    const [showAddListing, setShowAddListing] = useState(false);
    const [listingLoading, setListingLoading] = useState(false);

    const limit = 6;

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
    };

    const fetchListings = async () => {
        const queryObj = {
            limit,
            offset: skip
        }
        if (auth.user.role === 'core' || auth.user.role === 'staff') {

        } else {
            queryObj.company = auth.user.companyId.toString();
        }
        setListingLoading(true);
        try {
            const response = await axiosInstance.post('/api/listing/get-listings', queryObj);
            setListings(response.data.listings);
            setTotalPackages(response.data.total);
        } catch (error) {
            console.log(error);
        }
        setListingLoading(false);
    }

    useEffect(() => {
        fetchListings();
    }, [skip]);

    if(listingLoading) {
        return <FullPageSpin />
    }

    if (auth.user?.role === "admin" || auth.user?.role === "user") {
        return <>
            <PackageList
                packages={listings}
                totalPackages={totalPackages}
                limit={limit}
                skip={skip}
                onPageChange={handlePageChange}
                openAddListing={() => setShowAddListing(true)}
            />
            <CreateListingForm show={showAddListing} setShowAddListing={setShowAddListing} />
        </>
    } else {
        return <>
            <AdminPackageList
                packages={listings}
                totalPackages={totalPackages}
                limit={limit}
                skip={skip}
                onPageChange={handlePageChange}
            />
        </>
    }
}

export default Listings;