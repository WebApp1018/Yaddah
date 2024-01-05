import React from 'react';
import styles from './NewServiceProviderRequest.module.css'
import { useState, useEffect } from 'react';
//Components
import SidebarSkeleton from '../../Components/SidebarSkeleton';
import SearchBar from '../../Components/SearchBarWithHeader';
import UserCard from '../../Components/UserCard';
//DemoUserData

const NewServiceProviderRequest = () => {
    const [User, setUser] = useState([]);
    useEffect(() => {
        setUser(User.filter(e => e.userType === 'serviceProvider' && e.status === 'pending'))
    }, []);
    return (
        <SidebarSkeleton>
            <div className={ styles.content__wrapper }>
                <SearchBar header={'New Service Provider Request'} />
                <div className={ styles.userCard__wrapper }>
                    {
                        User.map(e => (
                            <UserCard item={e}/>
                        ))
                    }
                </div>
            </div>
        </SidebarSkeleton>
    );
}

export default NewServiceProviderRequest;
