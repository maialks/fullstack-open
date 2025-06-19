import React from 'react'
import Navbar from './components/Navbar'
import BlogsContainer from './components/BlogsContainer'
import Pagination from './components/Pagination'
import Title from './components/Title'

export default function Homepage() {
  const blogs = [
    { title: 'Blog 1', content: 'Conteúdo 1' },
    { title: 'Blog 2', content: 'Conteúdo 2' },
    { title: 'Blog 3', content: 'Conteúdo 3' },
    { title: 'Blog 4', content: 'Conteúdo 4' },
    { title: 'Blog 5', content: 'Conteúdo 5' },
    { title: 'Blog 6', content: 'Conteúdo 6' },
    { title: 'Blog 7', content: 'Conteúdo 7' },
    { title: 'Blog 8', content: 'Conteúdo 8' },
    { title: 'Blog 8', content: 'Conteúdo 9' },
    { title: 'Blog 8', content: 'Conteúdo 10' },
  ]

  return (
    <div id='main' className='h-full bg-background'>
      <Navbar />
      <Title>
        the
        <br />
        bloglist
      </Title>
      <Pagination items={blogs} />
    </div>
  )
}
