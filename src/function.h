#ifndef FUNCTION_H
#define FUNCTION_H

// Local File Stream
#include <QFile>
#include <QTextStream>

class TextData
{
public:
    QString Text_Data;
    void SAVE()
    {
        QFile *file = new QFile;
        file->setFileName("UserData.txt");
        file->open(QIODevice::WriteOnly);
        QTextStream out(file);
        out.setCodec("UTF-8");
        out << Text_Data;
        file->close();
    }
    void LOAD()
    {
        QFile *file = new QFile;
        file->setFileName("UserData.txt");
        file->open(QIODevice::ReadOnly);
        QTextStream in(file);
        in.setCodec("UTF-8");
        Text_Data = in.readAll();
        file->close();
    }
};

class IMGData
{
public:
    QString LINK;
    void SAVE()
    {
        QFile *file = new QFile;
        file->setFileName("IMGdata.dll");
        file->open(QIODevice::WriteOnly);
        QTextStream out(file);
        out.setCodec("UTF-8");
        out << LINK;
        file->close();
        delete file;
    }
    void LOAD()
    {
        QFile *file = new QFile;
        file->setFileName("IMGdata.dll");
        file->open(QIODevice::ReadOnly);
        QTextStream in(file);
        in.setCodec("UTF-8");
        LINK = in.readAll();
        file->close();
        delete file;
    }
};

class SettingData
{
public:
    int pos_x;
    int pos_y;
    int size_w;
    int size_h;
    int Auto_Start;
    int Opacity;

    SettingData()
    {
        QFile *file = new QFile;
        file->setFileName("config.dll");
        if(!file->open(QIODevice::ReadOnly | QIODevice::Text))
        {
            pos_x = 300;
            pos_y = 200;
            size_w = 640;
            size_h = 450;
            Auto_Start = 0;
            Opacity = 100;
        }
        else
        {
            LOAD();
        }
        file->close();
    }

    void SAVE()
    {
        QFile *file = new QFile;
        file->setFileName("config.dll");
        file->open(QIODevice::WriteOnly);
        QTextStream out(file);
        out << pos_x << "\n" << pos_y << "\n"
            << size_w << "\n" << size_h << "\n"
            << Auto_Start << "\n" << Opacity;
        file->close();
    }

    void LOAD()
    {
        QFile *file = new QFile;
        file->setFileName("config.dll");
        file->open(QIODevice::ReadOnly);
        QTextStream in(file);
        pos_x = in.readLine().toInt();
        pos_y = in.readLine().toInt();
        size_w = in.readLine().toInt();
        size_h = in.readLine().toInt();
        Auto_Start = in.readLine().toInt();
        Opacity = in.readLine().toInt();
        file->close();
    }
};

#endif // FUNCTION_H
