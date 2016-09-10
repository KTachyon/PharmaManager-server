module.exports = {
    getDatabaseURL : function() {
        return 'postgresql://user:pass@localhost:5432/dbname';
    },

    getLogLevel : function() {
        return 'DEBUG';
    },

    getServerPort : function() {
        return 3000;
    },

    getAPIBasePath : function() {
        return '/api';
    },

    getCrossdomainHeaders : function() {
        return {
        	'Access-Control-Allow-Origin' : function(request) {
        		return request.get('origin'); // Since we are using credentials, we can only return a single origin here! Use this to filter the allowed origins.
        	},
        	'Access-Control-Allow-Credentials' : true,
            'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, JITT-SESSION-TOKEN',
            'Access-Control-Allow-Methods' : 'GET, OPTIONS, PUT, POST, DELETE',
            'Access-Control-Max-Age': 86400
        };
    }
};
