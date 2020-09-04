import React, { useState, useEffect, FormEvent } from 'react'
import { Title, Form, Repositories, Error } from './styles'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import logoImg from '../../assets/logo.svg'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('@GithubExplore:repositories')

    if (storageRepositories) {
      return JSON.parse(storageRepositories)
    }
    return []

  })

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplore:repositories',
      JSON.stringify(repositories)
    )
  }, [repositories])

  async function handleAddRepository (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!newRepo) {
      setInputError('Digite autor/nome do repositório')
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`)

      setRepositories([...repositories, response.data])
      setNewRepo('')
      setInputError('')
    } catch (error) {
      setInputError('Erro na busca do repositório')
    }
  }

  return (
    <>
      <img src={logoImg} alt="GitHub Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form
        hasError={!!inputError}
        onSubmit={handleAddRepository}
      >
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"/>
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>

  )
}
export default Dashboard
