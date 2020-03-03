(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi', [			
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.demande_deblocage_feffi',
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.validation_demande_deblocage_feffi',
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.validation_technique_deblocage_feffi',
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.validation_financiere_deblocage_feffi',
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.transfert_daaf'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi', {
            title : 'Niveau DAAF/FEFFI',
            icon  : 'icon-data',
            weight: 1
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
