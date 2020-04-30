(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_physique_travaux', [
            'app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_batiment',
            'app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_latrine',
            'app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_mobilier'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_physique_travaux', {
            title : 'Suivi physique',
            icon  : 'icon-blur-radial',
            weight: 11
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
