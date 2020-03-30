(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_reliquat', [			
            'app.paeb.gerer_situation_reliquat.saisie_reliquat',
            'app.paeb.gerer_situation_reliquat.document_reliquat_scan'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_reliquat', {
            title : 'Gérer situation reliquat',
            icon  : 'icon-data',
            weight: 9
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
