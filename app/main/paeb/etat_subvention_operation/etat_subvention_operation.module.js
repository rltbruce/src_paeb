(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation', [
            'app.paeb.etat_subvention_operation.niveau_feffi_prestataire_etat',
            'app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat',
            'app.paeb.etat_subvention_operation.niveau_ufp_daaf_etat'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation', {
            title : 'Etats techniques des activités ',
            icon  : 'icon-data',
            weight: 3
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
