#include "setting.h"
#include "ui_setting.h"
#include "ui_mainform.h"
#include <QDesktopServices>

bool AutoStart = false;

Setting::Setting(MainForm &ref, QWidget *parent) :
    QDialog(parent),
    Mainref(ref),
    ui(new Ui::Setting)
{
    ui->setupUi(this);

    SettingData setData;
    ui->horizontalSlider->setValue(setData.Opacity);
    if(setData.Auto_Start==1)
    {
        ui->AutoStartCheck->setChecked(true);
    }
}

Setting::~Setting()
{
    delete ui;
}

void Setting::on_pushButton_3_clicked()
{
    m_fileName = QFileDialog::getOpenFileName(this, "Get Any File");
    m_img.load(m_fileName);
    int w = Mainref.ui->label->width();
    int h = Mainref.ui->label->height();
    Mainref.ui->label->setPixmap(m_img.scaled(w, h, Qt::KeepAspectRatio));
    Mainref.ui->label->setScaledContents(true);

    IMGData mIMG;
    mIMG.LINK = m_fileName;
    mIMG.SAVE();
}

void Setting::on_pushButton_clicked()
{
    QDesktopServices::openUrl(QUrl("http://baealex.tistory.com"));
}

void Setting::on_AutoStartCheck_stateChanged(int arg1)
{
    QFileInfo fileInfo(QCoreApplication::applicationFilePath());
    QString startDir = QStandardPaths::writableLocation(QStandardPaths::ApplicationsLocation)
            + QDir::separator() + "Startup"
            + QDir::separator() + fileInfo.completeBaseName() + ".lnk";

    if(AutoStart == false)
    {
        QFile::link(QCoreApplication::applicationFilePath(),startDir);
        AutoStart = true;

        SettingData setData;
        setData.Auto_Start=1;
        setData.SAVE();
    }
    else
    {
        QFile file(startDir);
        file.remove();
        AutoStart = false;

        SettingData setData;
        setData.Auto_Start=0;
        setData.SAVE();
    }
}

void Setting::on_horizontalSlider_valueChanged(int value)
{
    Mainref.setWindowOpacity((double)value/100);

    SettingData setData;
    setData.Opacity = value;
    setData.SAVE();
}
