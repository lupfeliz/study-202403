/**
 * @File        : header.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 헤더 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import userContext from '@/libs/user-context'
import * as C from '@/libs/constants'
import { Container, Block, Button, Link } from '@/components'
import { Drawer } from '@mui/material'
import { Menu as MenuIcon, ArrowBackIos as ArrowBackIcon } from '@mui/icons-material';
const { defineComponent, useSetup, goPage } = app
export default defineComponent(() => {
  const self = useSetup({
    vars: {
      aside: false
    },
    async mounted({ releaser }) {
      /** 사용자 로그인 만료시간 모니터링 */
      releaser(userContext.subscribe(() => update(C.UPDATE_SELF)))
    }
  })
  const { vars, update, ready } = self()
  const userInfo = userContext.getUserInfo()
  /** aside 메뉴 오픈 */
  const openAside = (visible: boolean) => {
    vars.aside = visible
    update(C.UPDATE_FULL)
  }
  const logout = async () => {
    await userContext.logout()
    alert('로그아웃 되었어요')
    goPage('/')
  }
  return (
    <header>
    <Container className='flex'>
      <Block>
        <Button
          size='small'
          onClick={() => goPage(-1)}
          >
          <ArrowBackIcon />
        </Button>
      </Block>
      <Block>
        <Link
          href={ '/' }
          >
          HEADER
        </Link>
      </Block>
      <Block>
        <Button
          size='small'
          onClick={ () => openAside(true) }
          >
          <MenuIcon />
        </Button>
      </Block>
    </Container>
    <Drawer
      className='header-aside'
      anchor='right'
      open={ vars.aside }
      onClick={ () => openAside(false) }
      >
      { ready() && (userInfo?.userId) && (
        <>
          <Block className='text-center my-1'>
            { userInfo.userNm }
          </Block>
          <Block className='text-center my-1'>
            { userInfo.timelabel }
          </Block>
        </>
      ) }
      <Block>
        <Button
          href={'/'}
          >
          홈
        </Button>
        { ready() && !(userInfo?.userId) ? (
        <>
          <Button
            href={'/lgn/lgn01001s01'}
            >
            로그인
          </Button>
          <Button
            href={'/usr/usr01001s01'}
            >
            회원가입
          </Button>
        </>
        ) : (
        <>
          <Button
            onClick={ userContext.tokenRefresh }
            >
            로그인연장
          </Button>
          <Button
            onClick={ logout }
            >
            로그아웃
          </Button>
          <Button
            href='/usr/usr01001s03'
            >
            마이페이지
          </Button>
        </>
        ) }
        <Button
          href='/atc/atc01001s04/1'
          >
          게시판
        </Button>
      </Block>
    </Drawer>
    </header>
  )
})