(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi', [			
            'app.paeb.gerer_situation_feffi.convention_cisco_feffi',
            'app.paeb.gerer_situation_feffi.convention_cisco_feffi_valide',
            'app.paeb.gerer_situation_feffi.feffi',
            'app.paeb.gerer_situation_feffi.dossier_feffi',
            'app.paeb.gerer_situation_feffi.document_feffi_scan',
            'app.paeb.gerer_situation_feffi.reporting',
            'app.paeb.gerer_situation_feffi.decaiss_fonct_feffi',
            'app.paeb.gerer_situation_feffi.decaiss_fonct_feffi_valide'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi', {
            title : 'Gérer situation feffi',
            icon  : 'icon-data',
            weight: 2
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
