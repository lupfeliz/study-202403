/**
 * @File        : atc01001s04/[pagenum].jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 목록 페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import userContext from '@/libs/user-context'
import * as C from '@/libs/constants'
import { Container, Block, Button, Pagination, Link } from '@/components'
import moment from 'moment'

const { definePage, useSetup, log, clone, getParameter, goPage } = app

export default definePage(() => {
  const self = useSetup({
    vars: {
      data: {
        list: [],
      },
      /** pagination 을위한 데이터 */
      pdata: {
        currentPage: 1,
        rowCount: 10,
        rowStart: 0,
        rowTotal: 0,
        keyword: '',
        searchType: '',
        orderType: ''
      },
      state: 0,
    },
    async mounted() {
      loadData(getParameter('pagenum') || 1)
    },
  })

  const { vars, update, ready } = self()
  const userInfo = userContext.getUserInfo()

  const print = {
    num: (inx) => (vars.pdata?.rowTotal || 0) - (vars.pdata?.rowStart || 0) - inx,
    cdate: (date) => date && moment(date).format('YYYY-MM-DD'),
    /** 상태에 따라 다른 메시지가 출력된다 */
    state(state) {
      switch (state) {
      case 0: return '잠시만 기다려 주세요.'
      case 2: return '검색된 게시물이 없습니다.'
      default: return state
      }
    }
  }

  const loadData = async (pagenum = C.UNDEFINED) => {
    vars.state = 0
    update(C.UPDATE_FULL)
    try {
      if (pagenum !== C.UNDEFINED) {
        vars.pdata.rowStart = ((pagenum - 1) || 0) * vars.pdata.rowCount
      }
      const pdata = clone(vars.pdata)
      const res = await api.post(`atc01001`, pdata)
      log.debug('RES:', res)
      vars.data = res
      if (vars.data.list.length != 0) {
        vars.state = 1
        vars.pdata.currentPage = pagenum
      } else {
        vars.state = 2
      }
      for (const k in vars.pdata) { Object.hasOwn(res, k) && (vars.pdata[k] = res[k]) }
    } catch (e) {
      vars.data.list = []
      vars.state = e?.message || '오류가 발생했습니다.'
      log.debug('E:', e)
    }
    update(C.UPDATE_FULL)
  }

  const pageChanged = async () => {
    goPage(`/atc/atc01001s04/${vars.pdata.currentPage}`)
  }
  return (
  <Container>
    <section className='title'>
      <h2>게시물 목록</h2>
      { ready() && userInfo.userId && (
      <Button
        variant='contained'
        href='/atc/atc01001s01'
        >
        새글작성
      </Button>
      ) }
    </section>
    <hr/>
    <section>
      <article>
        <Block>
          <table className='w-full articles'>
            <colgroup>
              <col width={'10%'} />
              <col width={'50%'} />
              <col width={'20%'} />
              <col width={'20%'} />
            </colgroup>
            <thead>
              <tr>
                <th> 순번 </th>
                <th> 제목 </th>
                <th> 작성자 </th>
                <th> 작성일 </th>
              </tr>
            </thead>
            <tbody>
            <tr><td colSpan={4} className='nopad'><hr/></td></tr>
            { (vars.data?.list?.length || 0) === 0 && (
              <tr><td colSpan={4} className='text-center'>{
                print.state(vars.state)
              }</td></tr>
            ) }
            { vars.data?.list?.map((itm, inx) => (
              <tr key={ inx }>
                <td className='text-right'> { print.num(inx) } </td>
                <td>
                  <Link
                    href={ `/atc/atc01001s03/${itm.id}` }
                    >
                    { itm?.title }
                  </Link>
                </td>
                <td> { itm?.userNm } </td>
                <td> { print.cdate(itm?.ctime) } </td>
              </tr>
            )) }
            </tbody>
          </table>
        </Block>
        <Block className='flex justify-center'>
          <Pagination
            model={ vars.pdata }
            onChange={ pageChanged }
            />
        </Block>
      </article>
    </section>
  </Container>
  )
})