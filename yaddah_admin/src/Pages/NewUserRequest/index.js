import React from 'react';
import { useState, useEffect } from 'react';
import styles from './NewUserRequest.module.css'
import SidebarSkeleton from '../../Components/SidebarSkeleton';
//Components
import SearchBar from '../../Components/SearchBarWithHeader';
import UserCard from '../../Components/UserCard';
//DemoUserData

const NewUserRequest = () => {
    const [User, setUser] = useState([]);
    useEffect(() => {
       setUser(User.filter(e => e.userType === 'user' && e.status === 'pending')) 
    }, []);
    return (
        <SidebarSkeleton>
            <div className={ styles.content__wrapper }>
                <SearchBar header={'New User Request'} isButtonVisible={false}/>
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

export default NewUserRequest;
