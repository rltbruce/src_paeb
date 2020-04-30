(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.prestation_mpe', [
            'app.paeb.gerer_situation_entreprise.prestation_mpe.prestation_mpe_validation',
            'app.paeb.gerer_situation_entreprise.prestation_mpe.phase_sous_projet_validation'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.prestation_mpe', {
            title : 'Prestation',
            icon  : 'icon-blur-radial',
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
