import axios from 'axios';
import { ethers } from 'ethers';
import 'dotenv/config';

const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
const wallet = new ethers.Wallet(process.env.ALICE_PRIVATE_KEY as string, provider);

const contractETH_ARBITRUM = '0x0000000000000000000000000000000000000000'
const contractETH_LINEA = '0x0000000000000000000000000000000000000000'
const Amount = ""

// Параметры для API запросов
const apiBaseUrl = 'https://api.dln.trade/v1.0/dln';


interface QuoteParams {
    srcChainId: number;
    srcChainTokenIn: string;
    srcChainTokenInAmount: string;
    dstChainId: number;
    dstChainTokenOut: string;
    prependOperatingExpenses: boolean;
    affiliateFeePercent: number;
}

interface OrderTxParams {
    srcChainId: number;
    dstChainId: number;
    srcChainTokenIn: string;
    dstChainTokenOut: string;
    srcChainTokenInAmount: string;
    dstChainTokenOutAmount: string;
    dstChainTokenOutRecipient: string;
    srcChainOrderAuthorityAddress: string;
    dstChainOrderAuthorityAddress: string;
    affiliateFeePercent: number;
    affiliateFeeRecipient: string;
}

// Функция для получения котировки
async function getQuote(params: QuoteParams) {
    try {
        const response = await axios.get(`${apiBaseUrl}/order/quote`, { params });
        //console.log('Quote response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return null;
    }
}

// Функция для создания транзакции ордера
async function createOrderTx(params: OrderTxParams) {
    try {
        const response = await axios.get(`${apiBaseUrl}/order/create-tx`, { params });
        //console.log('Create order transaction response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating order transaction:', error);
        return null;
    }
}

// Функция для отправки транзакции
async function sendTransaction(txData: any) {
    const gasPrise = await wallet.getGasPrice();
    const currentNonce = await provider.getTransactionCount(wallet.address, "latest");
    const tx1 = {
        from:wallet.address,
        to: txData.tx.to,
        data: txData.tx.data,
        value: ethers.utils.parseUnits(txData.tx.value, 'wei'),
        gasPrice:gasPrise,
        nonce: currentNonce
    }
    const estimatedGas = await wallet.estimateGas(tx1);
    const tx = {
        from:wallet.address,
        to: txData.tx.to,
        data: txData.tx.data,
        value: ethers.utils.parseUnits(txData.tx.value, 'wei'),
        gasLimit: estimatedGas,
        gasPrice: gasPrise,
        nonce: currentNonce
    };

    try {
        const signedTx = await wallet.signTransaction(tx);
        const txReceipt = await provider.sendTransaction(signedTx);
        console.log('Transaction sent! Receipt:', txReceipt);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Пример исполнения функций
async function executeOrder() {
    const quoteParams: QuoteParams = {
        srcChainId: 42161,
        srcChainTokenIn: contractETH_ARBITRUM,
        srcChainTokenInAmount: ethers.utils.parseUnits(Amount, 18).toString(),
        dstChainId: 59144,
        dstChainTokenOut: contractETH_LINEA,
        prependOperatingExpenses: true,
        affiliateFeePercent: 0.1
    };

    const quote = await getQuote(quoteParams);
    if (quote) {
        const orderTxParams: OrderTxParams = {
            srcChainId: 42161,
            dstChainId: 59144,
            srcChainTokenIn: contractETH_ARBITRUM,
            dstChainTokenOut: contractETH_LINEA,
            srcChainTokenInAmount: quote.estimation.srcChainTokenIn.amount,
            dstChainTokenOutAmount: quote.estimation.dstChainTokenOut.recommendedAmount,
            dstChainTokenOutRecipient: wallet.address,
            srcChainOrderAuthorityAddress: wallet.address,
            dstChainOrderAuthorityAddress: wallet.address,
            affiliateFeePercent: 0.1,
            affiliateFeeRecipient: wallet.address
        };
        const orderTx = await createOrderTx(orderTxParams);
        if (orderTx) {
            await sendTransaction(orderTx);
        }
    }
}

executeOrder();