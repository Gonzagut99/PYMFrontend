import { createContext, useContext, useEffect, useState } from 'react';
import { ContractsService } from '~/services/initialization';

interface WalletContextProps{
    account: string | null;
    accountData: AccountData | null;
    contractService: ContractsService;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
}

interface AccountData {
    account: string;
    ethSymbol: string;
    ethBalance: string;
    pymBalance: string;
    formattedBalance: string;
    symbol: string;
    decimals: number;
    formattedTotalSupply: string;
    totalSupply: string;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletProviderProps {
    contractService: ContractsService;
    children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, contractService:services }) => {
    // const contractServiceInstance = contractService;
    const contractService: ContractsService = services
    const [account, setAccount] = useState<string | null>(null);
    const [accountData, setAccountData] = useState<AccountData | null>({
        account: '',
        ethSymbol: 'ETH',
        ethBalance: '',
        pymBalance: '',
        formattedBalance: '',
        symbol: '',
        decimals: 0,
        formattedTotalSupply: '',
        totalSupply: ''
    });

    // useEffect(() => {
    //     const handleAccountChanged = (accounts: string[]) => {
    //         setAccount(accounts.length > 0 ? accounts[0] : null);
    //     };

    //     if (typeof window.ethereum !== 'undefined') {
    //         window.ethereum.on('accountsChanged', handleAccountChanged);
    //         window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountChanged);
    //     }

    //     return () => {
    //         if (typeof window.ethereum !== 'undefined') {
    //             window.ethereum.removeListener('accountsChanged', handleAccountChanged);
    //         }
    //     };
    // }, []);
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            // contractService = new ContractsService();
          const fetchAccount = async () => {
            const account = await contractService.requestAccount();
            setAccount(account);
          };
          fetchAccount();
        }
      }
      , [])

    useEffect(() => {
        const handleAccountChanged= (accounts: string[]) => {
          setAccount(accounts?.length>0 ? accounts[0] : null);
        }
        if (typeof window.ethereum !== 'undefined') {
          window.ethereum.on('accountsChanged', handleAccountChanged);
        }
        return () => {
          if (typeof window.ethereum !== 'undefined') {
            window.ethereum.removeListener('accountsChanged', handleAccountChanged);
          }
        }
      })

    useEffect(() => {
        const fetchAccountData = async () => {
          if (account) {
            const ethBalance = await contractService.getGovernanceContractService()?.getBalance(account);
            const pymBalanceData = await contractService.getGovernanceContractService()?.getPYMBalance(account);
            if (pymBalanceData && ethBalance) {
              const { balance, formattedBalance, symbol, decimals, formattedTotalSupply, totalSupply } = pymBalanceData;
              setAccountData({
                account,
                ethSymbol: 'ETH',
                ethBalance,
                pymBalance: balance,
                formattedBalance,
                symbol,
                decimals,
                formattedTotalSupply,
                totalSupply
              });
            }
          }
        };
        fetchAccountData();
      }, [account]);

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const account = await contractService.requestAccount();
                setAccount(account);
            } else {
                console.error('MetaMask no está instalado');
            }
        } catch (error) {
            console.error('Error al conectar la cuenta:', error);
        }
    };

    const disconnectWallet = async () => {
        try {
            await contractService.disconnectAccount();
            setAccount(null);
            setAccountData({
              account: '',
              ethSymbol: 'ETH',
              ethBalance: '',
              pymBalance: '',
              formattedBalance: '',
              symbol: '',
              decimals: 0,
              formattedTotalSupply: '',
              totalSupply: ''
            });
          } catch (error) {
            console.error('Error disconnecting wallet: ', error);
          }
    };

    return (
        <WalletContext.Provider value={{ account, accountData,  connectWallet, disconnectWallet, contractService }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet debe ser usado dentro de un WalletProvider');
    }
    return context;
};

// const useWallet = ({
//     contractServiceParam
// }: {
//     contractServiceParam: ContractsService;
// }) => {
//     const contractService:ContractsService = contractServiceParam
//     const [account, setAccount] = useState<string | null>(null);
//     const [accountData, setAccountData] = useState<AccountData | null>({
//         account: '',
//         ethSymbol: 'ETH',
//         ethBalance: '',
//         pymBalance: '',
//         formattedBalance: '',
//         symbol: '',
//         decimals: 0,
//         formattedTotalSupply: '',
//         totalSupply: ''
//     });

//     const connectWallet = async () => {
//         if (typeof window.ethereum !== 'undefined') {
//             try {
//                 const account = await contractService.requestAccount();
//                 setAccount(account);
//             } catch (error) {
//                 console.error('Error connecting wallet: ', error);
//             }
//         }
//     };

//     const disconnectWallet = async () => {
//         try {
//             await contractService.disconnectAccount();
//             setAccount(null);
//             setAccountData({
//                 account: '',
//                 ethSymbol: 'ETH',
//                 ethBalance: '',
//                 pymBalance: '',
//                 formattedBalance: '',
//                 symbol: '',
//                 decimals: 0,
//                 formattedTotalSupply: '',
//                 totalSupply: ''
//             });
//         } catch (error) {
//             console.error('Error disconnecting wallet: ', error);
//         }
//     };

//     return {
//         account,
//         accountData,
//         connectWallet,
//         disconnectWallet
//     };
// };

// export default useWallet;