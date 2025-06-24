import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Notification from '../notification/Notification'
import { useDispatch, useSelector } from 'react-redux'
import Title from '../../components/Title'
import Pagination from '../../components/Pagination'
import UsersContainer from './UsersContainer'
import useWindowWidth from '../../hooks/useWindowWidth'
import { initializeUsers } from './usersSlice'

const UsersList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const usrs = useSelector((state) => state.users.value)

  const windowWidth = useWindowWidth()
  let itemsPerPage = 5

  if (windowWidth >= 768 && windowWidth < 1024) itemsPerPage = 8
  if (windowWidth >= 1024) itemsPerPage = 12

  const notification = useSelector((state) => state.notification)
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      {notification.visible && <Notification />}
      <div className='lg:mt-[10vh]'>
        <Title>Users</Title>
        <Pagination
          items={usrs}
          render={(itemsToShow) => <UsersContainer users={itemsToShow} />}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  )
}

export default UsersList
