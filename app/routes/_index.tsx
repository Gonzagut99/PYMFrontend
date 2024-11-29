
import { redirect } from 'react-router'
import { useWallet } from '~/hooks/use-wallet'


 export const loader = async () => {
    return redirect('/home')
}
function _index() {
    const { account, connectWallet, disconnectWallet } = useWallet()
  return (
    <>

    </>
  )
}

export default _index