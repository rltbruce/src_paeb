(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_financier_mpe', [
            'app.paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_batiment_mpe',
            'app.paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_latrine_mpe',
            'app.paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_mobilier_mpe'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_financier_mpe', {
            title : 'Suivi financier',
            icon  : 'icon-blur-radial',
            weight: 12
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
