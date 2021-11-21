const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

const src = path.join(__dirname, 'src');

const DEV_PORT = 8080;

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: './src/index',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.[hash:8].js',
		publicPath: '/',
	},
	resolve: {
		alias: {
			'@': src,
			assets: path.join(src, 'assets'),
			components: path.join(src, 'components'),
			services: path.join(src, 'services'),
			models: path.join(src, 'models'),
			store: path.join(src, 'store'),
			utils: path.join(src, 'utils'),
			mocks: path.join(src, 'mocks'),
		},
		extensions: ['.tsx',
			'.ts',
			'.js'],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/u,
				exclude: /node_modules/u,
				use: {
					loader: 'ts-loader',
					options: {
						configFile: isProduction ? 'tsconfig.json' : 'tsconfig.dev.json',
					},
				},
			},
			{
				test: /\.(js|jsx)$/u,
				exclude: /node_modules/u,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.scss$/u,
				use: ['style-loader',
					'css-loader',
					'sass-loader'],
			},
			{
				test: /\.css$/u,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.less$/u,
				use: ['style-loader',
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								javascriptEnabled: true,
								modifyVars: {
									'border-radius-base': '12px',
								},
							},
						},
					}],
			},
			{
				test: /\.(jpg|png|gif|svg|pdf|ttf)$/u,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name]-[hash:8].[ext]',
						},
					},
				],
			},
			{
				test: /\.(ico|ttf)$/u,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: path.join(__dirname, '/dist/index.html'),
			favicon: path.join(__dirname, '/src/favicon.png'),
		}),
		isProduction ? new CopyWebpackPlugin({
			patterns: [{
				from: path.join(src, '/config'),
				to: path.join(__dirname, '/dist/config'),
			}],
		}) : new CopyWebpackPlugin({
			patterns: [{
				from: path.join(src, '/config/local.json'),
				to: path.join(__dirname, '/dist/config/base.json'),
			}],
		}),
		new CleanWebpackPlugin(),
		// new BundleAnalyzerPlugin(),
	],
	devServer: {
		publicPath: '/',
		contentBase: path.join(__dirname, '/dist'),
		hot: true,
		historyApiFallback: true,
		https: true,
		port: DEV_PORT,
		writeToDisk: true,
		proxy: {
			'/api': {
				target: 'https://santa.lionzxy.ru',
				changeOrigin: true,
				secure: false,
			},
		},
	},
	optimization: {
		minimize: true,
	},
};
