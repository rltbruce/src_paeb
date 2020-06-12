(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_ufp_daaf_etat', [	
            'app.paeb.etat_subvention_financiere.niveau_ufp_daaf_etat.demande_deblocage_daaf_validation_ufp_etat',
            //'app.paeb.etat_subvention_financiere.niveau_ufp_daaf_etat.transfert_ufp'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_ufp_daaf_etat', {
            title : 'Niveau UFP/DAAF',
            icon  : 'icon-flattr',
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
