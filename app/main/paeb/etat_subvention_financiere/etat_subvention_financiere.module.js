(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere', [
            'app.paeb.etat_subvention_financiere.niveau_ufp_daaf_etat',
            'app.paeb.etat_subvention_financiere.niveau_daaf_feffi_etat',
            'app.paeb.etat_subvention_financiere.niveau_feffi_prestataire_etat'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere', {
            title : 'Etats financiers des activités ',
            icon  : 'icon-credit-card-multiple',
            weight: 6
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
