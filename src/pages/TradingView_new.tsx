import { useState, useEffect } from 'react';
// import NeuralAI from '../neural.avif';
import axios from 'axios';
import { TextField } from '@mui/material';

const TradingView = () => {
    const [walletCounts, setWalletCounts] = useState<number | ''>(
        localStorage.getItem('walletCounts')
            ? Number(localStorage.getItem('walletCounts'))
            : '',
    ); // Initialize from localStorage
    const [AvaxFundAmount, setAvaxFundAmount] = useState<string | ''>(
        localStorage.getItem('AvaxFundAmount') || '',
    ); // Initialize from localStorage
    const [maxGas, setMaxGas] = useState<string | ''>(
        localStorage.getItem('maxGas') || '',
    ); // Initialize from localStorage
    const [tradingMintAmount, setTradingMintAmount] = useState<string | ''>(
        localStorage.getItem('tradingMintAmount') || '',
    ); // Initialize from localStorage
    const [tradingMaxAmount, setTradingMaxAmount] = useState<string | ''>(
        localStorage.getItem('tradingMaxAmount') || '',
    ); // Initialize from localStorage
    const [tradingMinInterval, setTradingMinInterval] = useState<string | ''>(
        localStorage.getItem('tradingMinInterval') || '',
    ); // Initialize from localStorage
    const [tradingMaxInterval, setTradingMaxInterval] = useState<string | ''>(
        localStorage.getItem('tradingMaxInterval') || '',
    ); // Initialize from localStorage
    const [isTrading, setIsTrading] = useState<boolean>(() => {
        
        const savedTradingStatus = localStorage.getItem('isTrading');
        return savedTradingStatus === 'true'; // Parse the string to boolean
    }); // Initialize from localStorage

    useEffect(() => {
        // Save each state to localStorage when it changes
        localStorage.setItem('walletCounts', JSON.stringify(walletCounts));
        localStorage.setItem('AvaxFundAmount', AvaxFundAmount);
        localStorage.setItem('maxGas', maxGas);
        localStorage.setItem('tradingMintAmount', tradingMintAmount);
        localStorage.setItem('tradingMaxAmount', tradingMaxAmount);
        localStorage.setItem('tradingMinInterval', tradingMinInterval);
        localStorage.setItem('tradingMaxInterval', tradingMaxInterval);
        localStorage.setItem('isTrading', JSON.stringify(isTrading));
    }, [
        walletCounts,
        AvaxFundAmount,
        maxGas,
        tradingMintAmount,
        tradingMaxAmount,
        tradingMinInterval,
        tradingMaxInterval,
        isTrading,
    ]);

    useEffect(() => {
        const getStatus = async () => {
            const result = await axios.get('http://localhost:5000/api/is_running');
            setIsTrading(result.data.message);
            console.log(result.data.message);
        };
        getStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isTrading) {
            alert(
                'Now, the Bot is trading. If you want new trading, please stop it first.',
            );
            return; // Prevent further execution if already trading
        }

        try {
            const result = await axios.post('http://localhost:5000/api/start', {
                walletCounts,
                AvaxFundAmount,
                maxGas,
                tradingMintAmount,
                tradingMaxAmount,
                tradingMinInterval,
                tradingMaxInterval,
            });
            console.log(result.data);
            setIsTrading(true); // Update trading status
        } catch (err) {
            console.log(err);
            alert('Bot started trading');
            setTimeout(() => {
                alert('No Balance!');
            }, 2000);
        }
    };

    const stopTrading = async () => {
        try {
            const result = await axios.post('http://localhost:5000/api/stop');
            console.log(result.data); // Handle the response as needed
            alert('Trading stopped');
            setIsTrading(false); // Update trading status
        } catch (err) {
            console.log(err);
            alert('An error occurred. Please try again later.');
        }
    };
    
    return (
        <div className='flex items-center justify-center h-screen w-screen overflow-auto'>
            {/* <div className='flex flex-col gap-10 items-center'>
                <img src={NeuralAI}></img>
                <span className='mainText'>Artificial Neural Network</span>
            </div> */}
            <div className='bg-[#3c3f48] p-6 '>
                <div className='text-[#c8c8d1] pb-6 text-2xl font-bold'>Liquidity Support</div>
                <div className='flex flex-col px-4 w-full items-center rounded-xl bg-[#28292e]'>
                    <div className='mt-10 w-full max-w-6xl p-4'>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-4 max-4'>
                                {/* First row: Wallet Address, Wallet Counts, Fund Amount */}
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Wallet Counts:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='number' // Integer type input
                                        value={walletCounts}
                                        sx={{background: '#161622', color: "white"}}
                                        onChange={(e) => setWalletCounts(Number(e.target.value) || '')}
                                        required
                                    />
                                </div>
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Max Gas:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='text' // Change to text input
                                        value={maxGas}
                                        sx={{background: '#161622', color: "white"}}
                                        onChange={(e) => setMaxGas(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Second row: Min Amount, Max Amount, Max Gas */}
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Min Amount:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='text' // Change to text input
                                        value={tradingMintAmount}
                                        sx={{background: '#161622', color: "white"}}
                                        onChange={(e) => setTradingMintAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Max Amount:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='text' // Change to text input
                                        value={tradingMaxAmount}
                                        sx={{background: '#161622', color: "white"}}
                                        onChange={(e) => setTradingMaxAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Third row: Min Interval and Max Interval */}
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Min Interval:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='text' // Change to text input
                                        value={tradingMinInterval}
                                        sx={{background: '#161622', color: "white"}}
                                        onChange={(e) => setTradingMinInterval(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Max Interval:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='text' // Change to text input
                                        value={tradingMaxInterval}
                                        sx={{background: '#161622', color: "white"}}
                                        onChange={(e) => setTradingMaxInterval(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='flex items-center'>
                                    <label className='flex-shrink-0 text-[#adaeb3] min-w-32'>
                                        <strong>Fund Amount:</strong>
                                    </label>
                                    <TextField
                                        className='form-control w-full rounded-md bg-slate-200 text-white'
                                        type='text' // Change to text input
                                        value={AvaxFundAmount}
                                        sx={{background: '#161622', color: "white", color: '#333'}}
                                        onChange={(e) => setAvaxFundAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='my-8 flex gap-4'>
                                <button
                                    type='submit'
                                    className='btn btn-success w-full rounded-md text-white bg-[#6168ff] p-2 disabled:opacity-65'
                                    disabled={isTrading} // Disable when trading
                                >
                                    Start
                                </button>
                                <button
                                    type='button'
                                    onClick={stopTrading}
                                    className='btn btn-danger w-full rounded-md text-white bg-[#ea0a00] p-2 disabled:opacity-65'
                                    disabled={!isTrading} // Disable when not trading
                                >
                                    Stop
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingView;
