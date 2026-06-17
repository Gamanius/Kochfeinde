import { createRootRoute, Outlet  } from '@tanstack/react-router'
import Header from '../components/Header'

const RootLayout = () => (
  <>
    <div className='h-dvh flex flex-col'>
      <Header>

      </Header>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  </>
)

export const Route = createRootRoute({ component: RootLayout })
