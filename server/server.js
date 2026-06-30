import app from './app.js'
import connectDB from './src/config/db.js'
import setupSocket from './src/socket/setup.js';

const PORT = process.env.PORT || 4000 

// Socket IO
const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

connectDB()


// initialize socket
setupSocket(server);

export { server };
