(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat', [
            'app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_cisco_feffi_etat',
            'app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.feffi_etat'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_cisco_feffi_etat', {
            title : 'Niveau CISCO/FEFFI',
            icon  : 'icon-black-mesa',
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
