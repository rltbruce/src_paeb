(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports', [
            //'app.paeb.reports.reporting',
            'app.paeb.reports.reporting_map',
            'app.paeb.reports.reporting_detail',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.reports', {
            title : 'Reporting',
            icon  : 'icon-data',
            weight: 7
        });



    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
